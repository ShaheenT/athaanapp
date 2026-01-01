import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Wrench, Plus, Search, Phone, Mail, MapPin, Calendar, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function TechniciansPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    location: ''
  });

  // Fetch technicians
  const { data: technicians, isLoading } = useQuery({
    queryKey: ['/api/technicians'],
  });

  // Create technician mutation
  const createTechnicianMutation = useMutation({
    mutationFn: async (technicianData: any) => {
      const response = await apiRequest('POST', '/api/technicians', technicianData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      setIsAddModalOpen(false);
      setNewTechnician({ name: '', email: '', phoneNumber: '', specialization: '', location: '' });
      toast({
        title: "Technician added",
        description: "New technician has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete technician mutation
  const deleteTechnicianMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/technicians/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      toast({
        title: "Technician removed",
        description: "Technician has been removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const filteredTechnicians = technicians?.filter((tech: any) =>
    tech.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateTechnician = () => {
    if (!newTechnician.name || !newTechnician.email || !newTechnician.phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please provide name, email, and phone number",
        variant: "destructive",
      });
      return;
    }
    
    createTechnicianMutation.mutate(newTechnician);
  };

  const getSpecializationBadge = (specialization: string) => {
    switch (specialization?.toLowerCase()) {
      case 'installation':
        return <Badge className="bg-blue-500">Installation</Badge>;
      case 'maintenance':
        return <Badge className="bg-green-500">Maintenance</Badge>;
      case 'repair':
        return <Badge className="bg-orange-500">Repair</Badge>;
      case 'networking':
        return <Badge className="bg-purple-500">Networking</Badge>;
      default:
        return <Badge variant="secondary">{specialization || 'General'}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wrench className="w-8 h-8 text-emerald-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t('technicians')}</h1>
                  <p className="text-gray-600">Manage installation and maintenance technicians</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Technician
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <User className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Technicians</p>
                    <p className="text-2xl font-bold text-gray-900">{technicians?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Wrench className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Installation Specialists</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {technicians?.filter((t: any) => t.specialization?.toLowerCase() === 'installation').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Maintenance Specialists</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {technicians?.filter((t: any) => t.specialization?.toLowerCase() === 'maintenance').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Service Areas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(technicians?.map((t: any) => t.location)).size || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, specialization, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technicians Table */}
          <Card>
            <CardHeader>
              <CardTitle>Technicians</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading technicians...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technician</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Service Area</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTechnicians.map((technician: any) => (
                      <TableRow key={technician.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{technician.name}</div>
                              <div className="text-sm text-gray-500">ID: {technician.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {technician.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {technician.phoneNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSpecializationBadge(technician.specialization)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">{technician.location || 'Not specified'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(technician.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteTechnicianMutation.mutate(technician.id)}
                              disabled={deleteTechnicianMutation.isPending}
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Add Technician Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Technician</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ahmad Hassan"
                    value={newTechnician.name}
                    onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmad@example.com"
                    value={newTechnician.email}
                    onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+27 12 345 6789"
                    value={newTechnician.phoneNumber}
                    onChange={(e) => setNewTechnician({ ...newTechnician, phoneNumber: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <select
                    id="specialization"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTechnician.specialization}
                    onChange={(e) => setNewTechnician({ ...newTechnician, specialization: e.target.value })}
                  >
                    <option value="">Select specialization</option>
                    <option value="installation">Installation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="location">Service Area</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Cape Town, Johannesburg"
                    value={newTechnician.location}
                    onChange={(e) => setNewTechnician({ ...newTechnician, location: e.target.value })}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleCreateTechnician}
                    disabled={createTechnicianMutation.isPending}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {createTechnicianMutation.isPending ? 'Adding...' : 'Add Technician'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}