
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListOrdered, Users, ShieldAlert, Settings } from 'lucide-react'; // Added Settings
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user } = useAuth(); 

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome, {user?.displayName || user?.username}!</p>
      </div>

      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-primary">
            <ShieldAlert className="mr-2 h-5 w-5 text-accent" /> Security Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary/80">
            This page is accessible only to authenticated administrators. 
            You are currently logged in as an admin.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-primary">
              <ListOrdered className="mr-2 h-5 w-5 text-accent" /> Event Management
            </CardTitle>
            <CardDescription>Create, view, edit, and delete campus events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button asChild size="lg" className="w-full">
              <Link href="/admin/events/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Event
              </Link>
            </Button> 
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/events/manage">
                 <Settings className="mr-2 h-5 w-5" /> Manage Existing Events
              </Link>
            </Button> 
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-primary">
              <Users className="mr-2 h-5 w-5 text-accent" /> User Management (Coming Soon)
            </CardTitle>
            <CardDescription>Oversee user accounts, roles, and permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will allow for management of user data and access levels. Currently under development.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8 bg-muted/50">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Welcome to the Admin Dashboard. More administrative features will be added here over time.
            Ensure you are following campus guidelines when managing events and user data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
