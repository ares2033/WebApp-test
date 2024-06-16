import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { LatestInvoiceRaw } from '../../lib/definitions';
import { formatCurrency } from '../../lib/utils';

export async function GET(res: NextApiResponse) {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return Response.json(latestInvoices);
  } catch (error) {
    console.error('Database Error:', error);
    return Response.error();
  }
}
