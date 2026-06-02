import { IOrder } from '@/services/order/order.types';
import { IProduct } from '@/types';
import Image from 'next/image';

const OrderPrint = ({ order }: { order: IOrder }) => {
  return (
    <section className="fixed inset-0 z-[9999] hidden bg-white p-10 font-sans leading-relaxed text-black print:block">
      <style
        dangerouslySetInnerHTML={{
          __html: `
                    @media print {
                        body * { visibility: hidden; }
                        .print-area, .print-area * { visibility: visible; }
                        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                        @page { margin: 1cm; }
                    }
                `,
        }}
      />

      <div className="print-area space-y-8">
        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b-4 border-blue-600 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-blue-600 uppercase">
              The Aranis
            </h1>
            <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">
              Premium E-commerce
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black">INVOICE</h2>
            <p className="font-bold text-blue-600">
              #{order._id?.slice(-8).toUpperCase()}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              Bill To
            </p>
            <div className="text-lg font-bold">{order.user?.fullName}</div>
            <div className="text-sm text-gray-500">{order.user?.email}</div>
            <div className="text-sm text-gray-500">{order.user?.phone}</div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
              Ship To
            </p>
            <div className="text-sm leading-relaxed font-bold">
              {order.shippingAddress}
            </div>
            {order.contactPhone && (
              <div className="mt-1 text-sm text-gray-500">
                <span className="font-bold text-gray-700">Contact Phone:</span>{' '}
                {order.contactPhone}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-bold text-gray-700">Payment:</span>{' '}
              {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-100 text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <th className="w-16 py-4 text-left">Image</th>
              <th className="py-4 text-left">Description</th>
              <th className="w-24 py-4 text-center">Price</th>
              <th className="w-20 py-4 text-center">Qty</th>
              <th className="w-32 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item, idx) => {
              const product = item.product as IProduct;
              return (
                <tr key={idx}>
                  <td className="py-6">
                    <div className="relative h-12 w-12 overflow-hidden rounded border border-gray-100">
                      <Image
                        src={
                          product?.thumbnails?.[0] ||
                          (product as any)?.image ||
                          '/placeholder.jpg'
                        }
                        alt={product?.name || 'Product Deleted'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="font-black text-gray-800">
                      {product?.name || 'Product Deleted'}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] tracking-widest text-gray-400 uppercase">
                      <span>{product?.category || 'N/A'}</span>
                      {item.color && (
                        <>
                          <span>•</span>
                          <span className="font-black text-gray-700">
                            {item.color}
                          </span>
                        </>
                      )}
                      {item.size && (
                        <>
                          <span>•</span>
                          <span className="font-black text-gray-700">
                            Size: {item.size}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-center text-sm">
                    ৳{item.price.toFixed(2)}
                  </td>
                  <td className="py-6 text-center text-sm font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-6 text-right font-black tracking-tight">
                    ৳{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end border-t-2 border-gray-100 pt-8">
          <div className="w-72 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Subtotal
              </span>
              <span className="font-bold text-gray-800">
                ৳{order.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Shipping
              </span>
              <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                {Number(order.shippingCharge).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t-2 border-blue-600 pt-4">
              <span className="text-sm font-black tracking-widest text-blue-600 uppercase">
                Grand Total
              </span>
              <span className="text-2xl font-black tracking-tighter text-blue-600">
                ৳{Number(order.totalPrice + order.shippingCharge).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 pt-16 text-center">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Thank you for shopping with Aranis
          </p>
          <p className="text-[10px] text-gray-300">
            This is a computer generated invoice and does not require a physical
            signature.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderPrint;
