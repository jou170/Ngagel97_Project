import connectDB from "@/app/api/mongoose";
import User from "@/models/User";

// PUT method for updating a user
export async function PUT(request, { params }) {
  const { id } = await params; // Access params.id directly
  
  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await connectDB(); // Ensure DB connection is successful

    const updatedData = await request.json(); // Get the updated data from the request

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    return new Response(
      JSON.stringify({ message: "User updated", user: updatedUser }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE method for soft deleting or unbanning a user
export async function DELETE(request, { params }) {
    const { id } = await params; // Access params.id directly
    
    if (!id) {
      return new Response(
        JSON.stringify({ message: "ID parameter is missing" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  
    try {
      await connectDB(); // Ensure DB connection is successful
      const user = await User.findById(id);
  
      if (!user) {
        return new Response(
          JSON.stringify({ message: "User not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      // Toggle 'deleted' status (if already deleted, set it back to false, i.e., unban)
      const newStatus = user.deleted ? false : true;
      
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { deleted: newStatus }, // Toggle delete status (soft delete or unban)
        { new: true }
      );
  
      return new Response(
        JSON.stringify({ message:"User status updated", user: updatedUser }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Failed to update user status" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  