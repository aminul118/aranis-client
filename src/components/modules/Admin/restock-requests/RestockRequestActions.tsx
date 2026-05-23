'use client';

import { Button } from '@/components/ui/button';
import useActionHandler from '@/hooks/useActionHandler';
import {
  IRestockRequest,
  resolveRestockRequest,
} from '@/services/restock/restock';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RestockRequestActions({
  request,
}: {
  request: IRestockRequest;
}) {
  const { executePost } = useActionHandler();
  const router = useRouter();

  const handleResolve = async () => {
    await executePost({
      action: () => resolveRestockRequest(request._id),
      success: {
        onSuccess: () => {
          router.refresh();
        },
        message: 'Request marked as resolved',
      },
    });
  };

  if (request.status === 'Resolved') {
    return <CheckCircle2 className="mx-auto text-emerald-500" size={20} />;
  }

  return (
    <Button
      size="sm"
      onClick={handleResolve}
      className="mx-auto block rounded-full bg-blue-600 font-bold text-white hover:bg-blue-700"
    >
      Mark Resolved
    </Button>
  );
}
