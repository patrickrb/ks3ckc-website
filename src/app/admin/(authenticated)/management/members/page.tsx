'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Member {
  id: string;
  name: string;
  callsign: string;
  active: boolean;
  misc?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    callsign: '',
    misc: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/admin/members');
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError('Failed to load members');
        toast({
          title: 'Error',
          description: 'Failed to load members',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.callsign) {
      toast({
        title: 'Error',
        description: 'Name and callsign are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) throw new Error('Failed to add member');

      const addedMember = await response.json();
      setMembers([...members, addedMember]);
      setNewMember({ name: '', callsign: '', misc: '' });
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!response.ok) throw new Error('Failed to update member');

      const updatedMember = await response.json();
      setMembers(
        members.map((member) => (member.id === id ? updatedMember : member))
      );
      toast({
        title: 'Success',
        description: 'Member status updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update member status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete member');

      setMembers(members.filter((member) => member.id !== id));
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Members Management</h1>
        <div className="text-center">Loading members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Members Management</h1>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Members Management</h1>

      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Member</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Enter member name"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="callsign">Callsign</Label>
              <Input
                id="callsign"
                value={newMember.callsign}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewMember({ ...newMember, callsign: e.target.value })
                }
                placeholder="Enter callsign"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddMember}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="misc">Additional Details</Label>
            <Textarea
              id="misc"
              value={newMember.misc}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNewMember({ ...newMember, misc: e.target.value })
              }
              placeholder="Enter any additional details about the member"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Callsign</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.callsign}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {member.misc}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={member.active}
                    onCheckedChange={() =>
                      handleToggleActive(member.id, member.active)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
