'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  deleteRestockRequestBulk,
  getRestockRequests,
  IRestockRequest,
  resolveRestockRequest,
} from '@/services/restock/restock';
import { BellRing, CheckCircle2, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RestockRequestsPage() {
  const [requests, setRequests] = useState<IRestockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await getRestockRequests();
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch restock requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await resolveRestockRequest(id);
      if (res.success) {
        toast.success('Request marked as resolved');
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'Resolved' } : r)),
        );
      }
    } catch (error) {
      toast.error('Failed to resolve request');
    }
  };

  const handleBulkDelete = async () => {
    if (
      confirm(`Are you sure you want to delete ${selectedIds.length} requests?`)
    ) {
      try {
        const res = await deleteRestockRequestBulk(selectedIds);
        if (res.success) {
          toast.success('Requests deleted successfully');
          setRequests((prev) =>
            prev.filter((r) => !selectedIds.includes(r._id)),
          );
          setSelectedIds([]);
        }
      } catch (error) {
        toast.error('Failed to delete requests');
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map((r) => r._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  if (loading) {
    return <div className="p-8 text-center font-bold">Loading requests...</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight uppercase">
            Restock Requests
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm font-bold"
            >
              {requests.filter((r) => r.status === 'Pending').length} Pending
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor which products your customers are waiting for.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {selectedIds.length > 0 && (
          <div className="animate-in slide-in-from-top-4 flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white shadow-xl duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <span className="font-black">{selectedIds.length}</span>
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase">
                  Requests Selected
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleBulkDelete}
                className="rounded-xl bg-red-500 text-[10px] font-black tracking-widest text-white uppercase hover:bg-red-600"
              >
                <Trash2 size={14} className="mr-2" /> Delete Selected
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedIds([])}
                className="rounded-xl text-[10px] font-bold tracking-widest text-white uppercase hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Card className="bg-card/50 border-none shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing size={20} className="text-blue-500" />
              Customer Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-muted-foreground py-20 text-center">
                No restock requests found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          selectedIds.length === requests.length &&
                          requests.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow
                      key={request._id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(request._id)}
                          onCheckedChange={() => toggleSelect(request._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="border-border relative h-12 w-10 overflow-hidden rounded-md border">
                            <Image
                              src={request.product.image}
                              alt={request.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold">{request.product.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {request.product.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {request.user.firstName} {request.user.lastName}
                            </p>
                            <p className="text-muted-foreground text-[10px]">
                              {request.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-black tracking-widest uppercase',
                            request.status === 'Pending'
                              ? 'border border-amber-500/20 bg-amber-500/10 text-amber-600'
                              : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
                          )}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleResolve(request._id)}
                            className="rounded-full bg-blue-600 font-bold text-white hover:bg-blue-700"
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {request.status === 'Resolved' && (
                          <CheckCircle2
                            className="ml-auto text-emerald-500"
                            size={20}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
