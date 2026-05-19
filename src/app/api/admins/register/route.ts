import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { isValidPassword } from '@/lib/password-reset';
import { getAdminByEmail, createAdmin } from '@/lib/db/admin';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 });
    }

    // Check if email already exists
    const existingAdmin = await getAdminByEmail(email.toLowerCase());
    if (existingAdmin) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin (transaction: profile + email lookup with uniqueness check)
    const admin = await createAdmin({ name, email: email.toLowerCase(), passwordHash });

    return NextResponse.json({
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err: any) {
    console.error('Admin registration error:', err);

    // Handle DynamoDB conditional check failure (email already exists race condition)
    if (err.name === 'TransactionCanceledException') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
