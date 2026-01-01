import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, Plus, Play, Pause, Download, Upload, Music, Mic } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function AudioProfilesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    fileUrl: '',
    duration: 0,
    language: 'arabic'
  });

  // Fetch audio profiles
  const { data: audioProfiles, isLoading } = useQuery({
    queryKey: ['/api/audio-profiles'],
  });

  // Create audio profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest('POST', '/api/audio-profiles', profileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/audio-profiles'] });
      setIsAddModalOpen(false);
      setNewProfile({ name: '', description: '', fileUrl: '', duration: 0, language: 'arabic' });
      toast({
        title: "Audio profile created",
        description: "New audio profile has been added successfully",
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

  // Delete audio profile mutation
  const deleteProfileMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/audio-profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/audio-profiles'] });
      toast({
        title: "Audio profile deleted",
        description: "Audio profile has been removed successfully",
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

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.fileUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both name and file URL",
        variant: "destructive",
      });
      return;
    }
    
    createProfileMutation.mutate(newProfile);
  };

  const getLanguageBadge = (language: string) => {
    switch (language) {
      case 'arabic':
        return <Badge className="bg-emerald-500">Arabic</Badge>;
      case 'english':
        return <Badge className="bg-blue-500">English</Badge>;
      case 'urdu':
        return <Badge className="bg-purple-500">Urdu</Badge>;
      default:
        return <Badge variant="secondary">{language}</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                <Volume2 className="w-8 h-8 text-emerald-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t('audioProfiles')}</h1>
                  <p className="text-gray-600">Manage Athaan audio files and prayer call recordings</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Audio Profile
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Music className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                    <p className="text-2xl font-bold text-gray-900">{audioProfiles?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Mic className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Arabic Profiles</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {audioProfiles?.filter((p: any) => p.language === 'arabic').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Volume2 className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">English Profiles</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {audioProfiles?.filter((p: any) => p.language === 'english').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Play className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Duration</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {audioProfiles?.length > 0 
                        ? formatDuration(Math.round(audioProfiles.reduce((sum: number, p: any) => sum + p.duration, 0) / audioProfiles.length))
                        : '0:00'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audio Profiles Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading audio profiles...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audioProfiles?.map((profile: any) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Volume2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{profile.name}</div>
                              <div className="text-sm text-gray-500">ID: {profile.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {profile.description || 'No description provided'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getLanguageBadge(profile.language)}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {formatDuration(profile.duration)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {new Date(profile.createdAt).toLocaleDateString()}
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
                              onClick={() => deleteProfileMutation.mutate(profile.id)}
                              disabled={deleteProfileMutation.isPending}
                            >
                              Delete
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

          {/* Add Audio Profile Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Audio Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Profile Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Traditional Fajr Call"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the audio profile..."
                    value={newProfile.description}
                    onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fileUrl">Audio File URL</Label>
                  <Input
                    id="fileUrl"
                    placeholder="https://example.com/audio/fajr.mp3"
                    value={newProfile.fileUrl}
                    onChange={(e) => setNewProfile({ ...newProfile, fileUrl: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="180"
                    value={newProfile.duration}
                    onChange={(e) => setNewProfile({ ...newProfile, duration: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newProfile.language}
                    onChange={(e) => setNewProfile({ ...newProfile, language: e.target.value })}
                  >
                    <option value="arabic">Arabic</option>
                    <option value="english">English</option>
                    <option value="urdu">Urdu</option>
                  </select>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleCreateProfile}
                    disabled={createProfileMutation.isPending}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {createProfileMutation.isPending ? 'Creating...' : 'Create Profile'}
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