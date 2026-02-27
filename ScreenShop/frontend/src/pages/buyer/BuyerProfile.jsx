import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

export default function BuyerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/buyer/profile", { headers: authHeader });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setForm({
          name: data.profile.name,
          email: data.profile.email,
          phone: data.profile.phone,
          address: data.profile.address,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/buyer/profile", {
        method: "PUT",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setEditMode(false);
        // Update localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: form.name,
            email: form.email,
            phone: form.phone,
          }),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!editMode ? (
          <button
            className="btn btn-primary btn-outline btn-sm"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setEditMode(false);
                setForm({
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone,
                  address: profile.address,
                });
              }}
            >
              <X size={16} /> Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="card bg-base-200 shadow max-w-2xl">
        <div className="card-body gap-6">
          {/* Name */}
          <div className="form-control">
            <label className="label label-text font-medium">Full Name</label>
            {editMode ? (
              <input
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <p className="px-1 py-2">{profile.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label label-text font-medium">Email</label>
            {editMode ? (
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            ) : (
              <p className="px-1 py-2">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label label-text font-medium">Phone</label>
            {editMode ? (
              <input
                type="tel"
                className="input input-bordered w-full"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            ) : (
              <p className="px-1 py-2">{profile.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label label-text font-medium">
              Delivery Address
            </label>
            {editMode ? (
              <textarea
                className="textarea textarea-bordered w-full"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            ) : (
              <p className="px-1 py-2">{profile.address}</p>
            )}
          </div>

          {/* Role badge */}
          <div className="form-control">
            <label className="label label-text font-medium">Account Type</label>
            <div className="px-1">
              <span className="badge badge-primary badge-outline">Buyer</span>
            </div>
          </div>

          {/* Member since */}
          <div className="form-control">
            <label className="label label-text font-medium">Member Since</label>
            <p className="px-1 py-2 text-sm opacity-60">
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
