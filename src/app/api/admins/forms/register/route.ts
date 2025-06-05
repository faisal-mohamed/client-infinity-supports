import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Basic JSON Schema validation
function validateJsonSchema(schema: any): { valid: boolean; error?: string } {
  try {
    // Check if it's a valid JSON object
    if (typeof schema !== 'object' || schema === null) {
      return { valid: false, error: 'Schema must be a valid JSON object' };
    }
    
    // Check for required JSON Schema properties
    if (!schema.type) {
      return { valid: false, error: 'Schema must have a "type" property' };
    }
    
    // If it has properties, ensure they're properly formatted
    if (schema.properties && typeof schema.properties !== 'object') {
      return { valid: false, error: 'Schema properties must be an object' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid JSON Schema format' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formKey, version, title, schema, autoVersion = false } = body;

    // Validate required fields
    if (!formKey || (!version && !autoVersion) || !title || !schema) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate JSON Schema format
    const schemaValidation = validateJsonSchema(schema);
    if (!schemaValidation.valid) {
      return NextResponse.json({ error: schemaValidation.error }, { status: 400 });
    }

    let versionToUse = version;

    // Auto-increment version if requested
    if (autoVersion) {
      // Find the latest version for this formKey
      const latestVersion = await prisma.masterForm.findFirst({
        where: { formKey },
        orderBy: { version: 'desc' },
        select: { version: true }
      });
      
      versionToUse = latestVersion ? latestVersion.version + 1 : 1;
    }

    // Check if the formKey+version already exists
    const existing = await prisma.masterForm.findUnique({
      where: {
        formKey_version: {
          formKey,
          version: versionToUse
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Form with this key and version already exists' }, { status: 409 });
    }

    // Create the new form version
    const created = await prisma.masterForm.create({
      data: {
        formKey,
        version: versionToUse,
        title,
        schema
      }
    });

    // Log the activity
    await prisma.formActivityLog.create({
      data: {
        action: 'FORM_VERSION_CREATED',
        formKey,
        baseVersion: versionToUse,
        metadata: {
          title,
          createdAt: new Date().toISOString()
        },
        performedById: req.headers.get('x-admin-id') ? parseInt(req.headers.get('x-admin-id') as string) : null
      }
    });

    return NextResponse.json({
      message: 'Form schema registered successfully',
      data: created
    });
  } catch (err) {
    console.error('Error registering form schema:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
