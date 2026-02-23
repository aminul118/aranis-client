'use client';

import BackButton from '@/components/common/button/back-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradientTitle from '@/components/ui/gradientTitle';
import { Separator } from '@/components/ui/separator';
import { IInvoice } from '@/types';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import UpdateInvoiceDialog from './UpdateInvoiceDialog';

type Props = { invoice: IInvoice };

const Row = ({ label, value }: { label: string; value?: any }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value ?? '—'}</span>
  </div>
);

const InvoiceDetails = ({ invoice }: Props) => {
  const [editOpen, setEditOpen] = useState(false);

  const isPaid = invoice.status === 'PAID';

  //  close dialog safely if invoice becomes PAID
  useEffect(() => {
    if (isPaid) setEditOpen(false);
  }, [isPaid]);

  return (
    <div className="mx-auto w-11/12 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="pt-4">
          <GradientTitle title="Invoice Details" />
        </div>

        <div className="flex items-center gap-2">
          <BackButton label="Back" />
          {/*  Option A: hide button when paid */}
          {!isPaid && (
            <Button onClick={() => setEditOpen(true)}>
              <Pencil /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Payable To */}
      <div className="flex items-center justify-between gap-12">
        <Card className="w-full max-w-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Payable To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Name" value={invoice.payableTo?.name} />
            <Row label="Phone" value={invoice.payableTo?.phone} />
            <Row label="Address" value={invoice.payableTo?.address} />
          </CardContent>
        </Card>
        {/* Invoice no */}
        <Card className="w-full max-w-lg rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label="Invoice No" value={invoice.invoiceNo} />
            <Row label="Date" value={invoice.invoiceDate} />
            <Row label="Status" value={invoice.status} />
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-muted-foreground grid grid-cols-12 gap-2 text-xs">
            <div className="col-span-6">Item</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          <Separator />

          {invoice.items?.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 text-sm">
              <div className="col-span-6 font-medium">{it.itemName}</div>
              <div className="col-span-2">{it.quantity}</div>
              <div className="col-span-2 text-right">{it.price}</div>
              <div className="col-span-2 text-right font-semibold">
                {it.total}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="ml-auto max-w-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Row label="Sub Total" value={invoice.subTotal} />
          <Row label="Discount" value={invoice.discount} />
          <Row label="Tax" value={invoice.tax} />
          <Separator />
          <Row label="Grand Total" value={invoice.grandTotal} />
        </CardContent>
      </Card>

      {/* Note */}
      {invoice.note ? (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{invoice.note}</CardContent>
        </Card>
      ) : null}

      {/* Edit dialog */}
      <UpdateInvoiceDialog
        open={editOpen}
        setOpen={setEditOpen}
        invoice={invoice}
      />
    </div>
  );
};

export default InvoiceDetails;
