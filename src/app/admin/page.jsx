import DashboardStates from "@/components/admin/DashboardStates";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecentActivity from "@/components/admin/RecentActivity";
import RecentRecipes from "@/components/admin/RecentRecipes";
import RecipeAnalytics from "@/components/admin/RecipeAnalytics";

const AdminPage = () => {
    return (
        <div className="p-4 pt-16 md:pt-4"> {/* Extra padding-top to account for mobile menu button */}
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
                    <p className="text-lg text-gray-600">Welcome to your admin dashboard. Manage your recipes, categories, reviews, and users.</p>
                </div>
                <div className="">
                    <Link href="/admin/recipes">
                        <Button> + Add New Recipe</Button>
                    </Link>
                </div>
            </div>
            
            <DashboardStates />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RecentActivity />
                <RecentRecipes />
            </div>
            
            <RecipeAnalytics />
        </div>
    );
};

export default AdminPage;