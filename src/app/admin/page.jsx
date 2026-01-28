import DashboardStates from "@/components/admin/DashboardStates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminPage = () => {
  return (
    <div className="p-4 pt-20 md:pt-20">
      {/* Extra padding-top to account for mobile menu button */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="text-2xl sm:text-3xl">Admin Dashboard</CardTitle>
            <Link href="/admin/recipes">
              <Button className="w-full sm:w-auto">+ Add New Recipe</Button>
            </Link>
          </div>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Welcome to your admin dashboard. Manage your recipes, categories, reviews, and users.
          </p>
        </CardHeader>
        <CardContent>
          <DashboardStates />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
