'use client';

import SubmitButton from '@/components/common/button/submit-button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useActionHandler from '@/hooks/useActionHandler';
import { updateInvoice } from '@/services/invoice/invoice';
import { IInvoice, IModal } from '@/types';
import { InvoiceFormValues, invoiceSchema } from '@/zod/invoice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Resolver, useFieldArray, useForm } from 'react-hook-form';

interface Props extends IModal {
  invoice: IInvoice;
}

const STATUSES = ['PENDING', 'UNPAID', 'PAID'] as const;

export default function UpdateInvoiceDialog({ open, setOpen, invoice }: Props) {
  const { executePost } = useActionHandler();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as Resolver<InvoiceFormValues>,
    defaultValues: {
      payableTo: { name: '', address: '', phone: '' },
      items: [{ itemName: '', quantity: '1', price: 0, total: 0 }],
      subTotal: 0,
      discount: 0,
      tax: 0,
      grandTotal: 0,
      note: '',
      paymentInfo: false,
      status: 'PENDING',
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    if (!open) return;

    const mappedItems = invoice.items?.length
      ? invoice.items.map((it) => ({
          itemName: it.itemName || '',
          quantity: it.quantity || '1',
          price: Number(it.price) || 0,
          total: Number(it.total) || 0,
        }))
      : [{ itemName: '', quantity: '1', price: 0, total: 0 }];

    form.reset({
      payableTo: {
        name: invoice.payableTo?.name || '',
        address: invoice.payableTo?.address || '',
        phone: invoice.payableTo?.phone || '',
      },
      items: mappedItems,
      subTotal: Number(invoice.subTotal) || 0,
      discount: Number(invoice.discount) || 0,
      tax: Number(invoice.tax) || 0,
      grandTotal: Number(invoice.grandTotal) || 0,
      note: invoice.note || '',
      paymentInfo: Boolean(invoice?.paymentInfo) || false,
      status: invoice.status || 'PENDING',
    });

    replace(mappedItems);
  }, [open, invoice, form, replace]);

  // ===== totals (live) =====
  const items = form.watch('items');
  const discount = form.watch('discount');
  const status = form.watch('status');

  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    return subTotal - (Number(discount) || 0);
  }, [subTotal, discount]);

  useEffect(() => {
    form.setValue('subTotal', subTotal);
    form.setValue('grandTotal', grandTotal);
  }, [subTotal, grandTotal, form]);

  //  if status becomes PAID, disable paymentInfo (backend also clears)
  useEffect(() => {
    if (status === 'PAID') {
      form.setValue('paymentInfo', false);
    }
  }, [status, form]);

  const onSubmit = async (data: InvoiceFormValues) => {
    // optional: ensure payload matches backend expectations
    await executePost({
      action: () => updateInvoice(data, invoice._id),
      success: {
        onSuccess: () => setOpen(false),
        loadingText: 'Updating invoice...',
        message: 'Invoice updated successfully',
      },
      errorMessage: 'Failed to update invoice.',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="lg:max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Update Invoice</AlertDialogTitle>
          <AlertDialogDescription>
            Update invoice details and save changes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-8"
          >
            {/* PAYABLE TO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payable To</h3>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="payableTo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payableTo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="payableTo.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({ itemName: '', quantity: '1', price: 0, total: 0 })
                  }
                >
                  <Plus /> Add Item
                </Button>
              </div>

              {fields.map((f, index) => (
                <div
                  key={f.id}
                  className="grid items-end gap-3 md:grid-cols-12"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.itemName`}
                    render={({ field }) => (
                      <FormItem className="col-span-5">
                        <FormLabel>Item</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Qty */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const qtyStr = e.target.value;
                              const qty = Number(qtyStr) || 1;
                              const price =
                                Number(
                                  form.getValues(`items.${index}.price`),
                                ) || 0;

                              form.setValue(
                                `items.${index}.total`,
                                price * qty,
                              );
                              field.onChange(qtyStr);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? 0}
                            onChange={(e) => {
                              const price = Number(e.target.value) || 0;
                              const qty =
                                Number(
                                  form.getValues(`items.${index}.quantity`),
                                ) || 1;

                              form.setValue(
                                `items.${index}.total`,
                                price * qty,
                              );
                              field.onChange(price);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Total */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.total`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input disabled value={field.value ?? 0} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* TOTALS */}
            <div className="grid gap-4 md:grid-cols-4">
              <FormItem>
                <FormLabel>Sub Total</FormLabel>
                <Input value={subTotal} disabled />
              </FormItem>

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Tax (%)</FormLabel>
                <Input value={0} disabled />
              </FormItem>

              <FormItem>
                <FormLabel>Grand Total</FormLabel>
                <Input value={grandTotal} disabled />
              </FormItem>
            </div>

            {/* NOTE */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input placeholder="Footer note..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/*  STATUS SELECT */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((st) => (
                            <SelectItem key={st} value={st}>
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* PAYMENT INFO */}
            <FormField
              control={form.control}
              name="paymentInfo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={status === 'PAID'}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include payment information</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Check this if payment details should appear on the invoice
                    </p>
                    {status === 'PAID' && (
                      <p className="text-muted-foreground text-xs">
                        Payment info is disabled when status is PAID.
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <AlertDialogFooter className="flex justify-end gap-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" type="button">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </AlertDialogCancel>

              <SubmitButton
                loading={form.formState.isSubmitting}
                text="Save Changes"
                icon={<Save className="mr-2 h-4 w-4" />}
                loadingEffect
                loadingText="Saving..."
              />
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
