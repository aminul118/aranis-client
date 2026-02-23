'use server';

import { revalidate } from '@/lib/revalidate';
import serverFetch from '@/lib/server-fetch';
import { ApiResponse, IInvoice } from '@/types';
import { InvoiceFormValues } from '@/zod/invoice';

interface IInvoiceItem {
  itemName: string;
  quantity: string;
  price: number;
  total: number;
}

interface IPayableTo {
  name: string;
  address?: string;
  phone?: string;
}

interface IInvoicePayload {
  payableTo: IPayableTo;
  items: IInvoiceItem[];
  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  note?: string;
}

const createInvoice = async (payload: IInvoicePayload) => {
  const res = await serverFetch.post<ApiResponse<IInvoice>>('/invoice/create', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  revalidate('invoice');
  return res;
};

const updateInvoice = async (payload: InvoiceFormValues, id: string) => {
  const res = await serverFetch.put<ApiResponse<IInvoice>>(`/invoice/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  revalidate('invoice');
  return res;
};

const sendInvoice = async (id: string, email: string) => {
  const res = await serverFetch.post<ApiResponse<IInvoice>>(
    `/invoice/${id}/send`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    },
  );

  return res;
};

const deleteSingleInvoice = async (id: string) => {
  const res = await serverFetch.delete<ApiResponse<IInvoice>>(`/invoice/${id}`);
  revalidate('invoice');
  return res;
};

const getInvoices = async (query: Record<string, string>) => {
  return await serverFetch.get<ApiResponse<IInvoice[]>>('/invoice/get-all', {
    query,
    cache: 'force-cache',
    next: {
      tags: ['invoice'],
    },
  });
};

const getSingleInvoice = async (slug: string) => {
  return await serverFetch.get<ApiResponse<null>>(`/invoice/${slug}`);
};

export {
  createInvoice,
  deleteSingleInvoice,
  getInvoices,
  getSingleInvoice,
  sendInvoice,
  updateInvoice,
};
