'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, TicketPercent, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { deleteCoupon, getCoupons, ICoupon, createCoupon, updateCoupon } from '@/services/coupon/coupon';
import { toast } from 'sonner';
import useActionHandler from '@/hooks/useActionHandler';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const CouponsPage = () => {
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { executePost } = useActionHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        discount: 0,
        expiryDate: '',
    });

    const fetchCoupons = async () => {
        try {
            const { data } = await getCoupons({ name: searchQuery });
            setCoupons(data || []);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [searchQuery]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        await executePost({
            action: () => deleteCoupon(id),
            success: {
                onSuccess: fetchCoupons,
                message: 'Coupon deleted successfully',
            },
        });
    };

    const handleOpenModal = (coupon?: ICoupon) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                name: coupon.name,
                code: coupon.code,
                discount: coupon.discount,
                expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
            });
        } else {
            setEditingCoupon(null);
            setFormData({ name: '', code: '', discount: 0, expiryDate: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = editingCoupon
            ? () => updateCoupon(formData, editingCoupon._id!)
            : () => createCoupon(formData as any);

        await executePost({
            action,
            success: {
                onSuccess: () => {
                    setIsModalOpen(false);
                    fetchCoupons();
                },
                message: editingCoupon ? 'Coupon updated' : 'Coupon created',
            },
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                        <TicketPercent className="h-8 w-8 text-blue-500" />
                        Coupon Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage discounts and promotional codes.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="rounded-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Coupon
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search coupons..."
                    className="pl-10 max-w-md bg-card border-border rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="border border-border rounded-3xl overflow-hidden bg-card/40 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold">Code</TableHead>
                            <TableHead className="font-bold">Discount (%)</TableHead>
                            <TableHead className="font-bold">Expiry Date</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="text-right font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : coupons.length > 0 ? (
                            coupons.map((coupon) => (
                                <TableRow key={coupon._id} className="border-border hover:bg-white/[0.02]">
                                    <TableCell className="font-medium">{coupon.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-blue-500 border-blue-500/20 bg-blue-500/5">
                                            {coupon.code}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-lg">{coupon.discount}%</TableCell>
                                    <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {new Date(coupon.expiryDate) < new Date() ? (
                                            <Badge variant="destructive">Expired</Badge>
                                        ) : (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(coupon)} className="text-muted-foreground hover:text-blue-500">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id!)} className="text-muted-foreground hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                    No coupons found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Coupon Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Summer Sale"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Coupon Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. SUMMER50"
                                className="font-mono"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount (%)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CouponsPage;
