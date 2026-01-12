import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"
import { EditProfileForm } from "@/components/edit-profile-form"

export default async function EditProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Edit Profile</h1>
        <EditProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  )
}
