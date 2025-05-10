
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListOrdered, Users, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
// import { useAuth } from '@/contexts/AuthContext'; // Already handled by AuthenticatedLayout for login
// import { useRouter } from 'next/navigation'; // Not needed for basic login check, layout handles redirect

export default function AdminPage() {
  // const { user, loading } = useAuth(); // user object can be used for role-specific checks
  // const router = useRouter();

  // Example for role-based authorization (conceptual)
  // useEffect(() => {
  //   if (!loading && user) {
  //     // Replace this with your actual admin check logic
  //     // const isAdmin = user.email === 'admin@example.com' || user.customClaims?.admin === true;
  //     // if (!isAdmin) {
  //     //   router.push('/dashboard'); // or an access denied page
  //     // }
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-4">Loading admin...</p></div>;
  // }

  // If not an admin (based on future logic), you might show an access denied message
  // For now, AuthenticatedLayout ensures user is logged in.

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
      </div>

      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-primary">
            <ShieldAlert className="mr-2 h-5 w-5 text-accent" /> Security Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary/80">
            This page is now accessible only to authenticated users. For production, implement role-based access control
            to ensure only authorized administrators can view this dashboard and perform admin actions.
            You can check user roles (e.g., via Firebase Custom Claims or a database lookup) within this component.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-primary">
              <ListOrdered className="mr-2 h-5 w-5 text-accent" /> Event Management
            </CardTitle>
            <CardDescription>Create, view, and manage campus events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Access tools to add new events to the platform or oversee existing ones.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/events/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Event
              </Link>
            </Button>
            {/* Placeholder for View/Edit Events link */}
            {/* 
            <Button asChild variant="outline" className="w-full mt-2">
              <Link href="/admin/manage-events">
                View & Manage Events
              </Link>
            </Button> 
            */}
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
            {/* Placeholder for user management tools */}
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
