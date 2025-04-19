import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings and pricing</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                name: "Basic Home Cleaning",
                description: "Standard cleaning service for homes up to 1,500 sq ft",
                price: "$120",
                duration: "2 hours",
                bookings: 24,
              },
              {
                id: 2,
                name: "Deep Home Cleaning",
                description: "Thorough cleaning including hard-to-reach areas and appliances",
                price: "$200",
                duration: "4 hours",
                bookings: 18,
              },
              {
                id: 3,
                name: "Move-in/Move-out Cleaning",
                description: "Complete cleaning for moving in or out of a property",
                price: "$250",
                duration: "5 hours",
                bookings: 12,
              },
              {
                id: 4,
                name: "Office Cleaning",
                description: "Professional cleaning for office spaces up to 2,000 sq ft",
                price: "$180",
                duration: "3 hours",
                bookings: 8,
              },
            ].map((service) => (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription className="mt-1">{service.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">{service.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{service.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bookings</p>
                      <p className="font-medium">{service.bookings}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Services</CardTitle>
              <CardDescription>Services that are not yet published</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You have no draft services.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="archived" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archived Services</CardTitle>
              <CardDescription>Services that are no longer offered</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">You have no archived services.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
