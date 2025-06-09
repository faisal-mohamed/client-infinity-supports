// API client functions for interacting with the backend

// Form API functions
export async function getForms() {
  const response = await fetch('/api/forms');
  if (!response.ok) {
    throw new Error('Failed to fetch forms');
  }
  return response.json();
}

export async function getFormVersions(formKey: string) {
  const response = await fetch(`/api/forms?formKey=${encodeURIComponent(formKey)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch form versions');
  }
  return response.json();
}

export async function getForm(id: number) {
  const response = await fetch(`/api/forms/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch form');
  }
  return response.json();
}

export async function createForm(formData: {
  formKey: string;
  title: string;
  schema: any;
}) {
  const response = await fetch('/api/forms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create form');
  }
  
  return response.json();
}

// Client API functions
export async function getClients(search?: string, filters?: {
  state?: string;
  sex?: string;
  hasNdis?: boolean;
  hasDisability?: boolean;
}) {
  let url = '/api/clients';
  const params = new URLSearchParams();
  
  if (search) {
    params.append('search', search);
  }
  
  if (filters) {
    if (filters.state) params.append('state', filters.state);
    if (filters.sex) params.append('sex', filters.sex);
    if (filters.hasNdis !== undefined) params.append('hasNdis', String(filters.hasNdis));
    if (filters.hasDisability !== undefined) params.append('hasDisability', String(filters.hasDisability));
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
    
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

export async function getClient(id: number) {
  const response = await fetch(`/api/clients/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }
  return response.json();
}

export async function createClient(clientData: {
  name: string;
  email?: string;
  phone?: string;
  commonFields?: {
    age?: number;
    sex?: string;
    street?: string;
    state?: string;
    postCode?: string;
    dob?: string;
    ndis?: string;
    disability?: string;
    address?: string;
  };
}) {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create client');
  }
  
  return response.json();
}

export async function updateClient(id: number, clientData: {
  name: string;
  email?: string;
  phone?: string;
  commonFields?: {
    age?: number;
    sex?: string;
    street?: string;
    state?: string;
    postCode?: string;
    dob?: string;
    ndis?: string;
    disability?: string;
    address?: string;
  };
}) {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update client');
  }
  
  return response.json();
}

export async function deleteClient(id: number) {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete client');
  }
  
  return response.json();
}

// Client Forms API functions
export async function getClientForms(clientId: number) {
  const response = await fetch(`/api/clients/${clientId}/forms`);
  if (!response.ok) {
    throw new Error('Failed to fetch client forms');
  }
  return response.json();
}

export async function assignFormToClient(clientId: number, data: {
  formId: number;
  expiresAt: string; // ISO date string
}) {
  const response = await fetch(`/api/clients/${clientId}/forms/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to assign form');
  }
  
  return response.json();
}

export async function getClientFormSubmission(clientId: number, formId: number) {
  const response = await fetch(`/api/clients/${clientId}/forms/${formId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch form submission');
  }
  return response.json();
}

export async function saveClientFormSubmission(clientId: number, formId: number, data: {
  data: any;
  isSubmitted?: boolean;
}) {
  const response = await fetch(`/api/clients/${clientId}/forms/${formId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save form submission');
  }
  
  return response.json();
}

// PDF Generation
export function generatePdfUrl(options: {
  formKey?: string;
  formId?: number;
  clientId?: number;
  download?: boolean;
}) {
  const params = new URLSearchParams();
  
  if (options.formKey) {
    params.append('formKey', options.formKey);
  }
  
  if (options.formId) {
    params.append('formId', options.formId.toString());
  }
  
  if (options.clientId) {
    params.append('clientId', options.clientId.toString());
  }
  
  if (options.download) {
    params.append('download', 'true');
  }
  
  return `/api/generate-pdf?${params.toString()}`;
}
