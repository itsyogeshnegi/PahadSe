import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Hash,
  ShoppingBag,
  CheckCircle2,
  Clock,
} from "lucide-react";

const runWithTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Database request timed out. Please check if Firestore Database is created and enabled in your Firebase Console."
            )
          ),
        ms
      )
    ),
  ]);
};

export function UserProfileDialog({ trigger }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "user_detail", user.uid);
        const docSnap = await runWithTimeout(getDoc(docRef), 5000);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || user.displayName || "");
          setPhone(data.phone || "");
          setAge(data.age !== undefined && data.age !== null ? String(data.age) : "");
          setAddress(data.address || "");
          setPincode(data.pincode !== undefined && data.pincode !== null ? String(data.pincode) : "");
        } else {
          setName(user.displayName || "");
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchProfile();
  }, [user, open]);

  useEffect(() => {
    if (!user || !open || activeTab !== "orders") return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const q = query(collection(db, "order_history"), where("userId", "==", user.uid));
        const querySnapshot = await runWithTimeout(getDocs(q), 5000);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(list);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user, open, activeTab]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const docRef = doc(db, "user_detail", user.uid);
      await runWithTimeout(
        setDoc(
          docRef,
          {
            name,
            email: user.email,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ),
        5000
      );

      if (name !== user.displayName) {
        await runWithTimeout(updateProfile(user, { displayName: name }), 5000);
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md bg-background border border-border/80 rounded-2xl p-6 shadow-lg flex flex-col max-h-[85vh]">
        <DialogHeader className="text-left border-b border-border/40 pb-3">
          <DialogTitle className="text-2xl font-display text-primary font-bold">
            My Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Manage your personal details and view your order log.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full rounded-lg bg-secondary p-1 text-xs select-none mt-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 rounded py-1.5 text-center font-medium transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 rounded py-1.5 text-center font-medium transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Order History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {activeTab === "profile" ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
              {success && (
                <div className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="size-4" />
                  {success}
                </div>
              )}
              {error && (
                <div className="text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center animate-in fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <Label
                  htmlFor="profile-name"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <User className="size-4" />
                  </span>
                  <Input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 h-9 w-full rounded-lg border border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Mail className="size-4" />
                  </span>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    className="pl-9 h-9 w-full rounded-lg border border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Hidden other profile details temporarily */}

              <Button
                type="submit"
                size="lg"
                className="w-full font-semibold cursor-pointer mt-4"
                disabled={saving}
              >
                {saving ? "Saving Details..." : "Update Profile"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2 animate-in fade-in">
                  <Clock className="size-8 animate-spin text-primary" />
                  <span className="text-xs font-medium">Loading your orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2 text-center animate-in fade-in">
                  <ShoppingBag className="size-10 text-muted-foreground/40 stroke-[1.5]" />
                  <div className="text-sm font-semibold">No orders yet</div>
                  <p className="text-xs max-w-xs text-muted-foreground/80 mt-1">
                    Add products to your cart and complete checkout on WhatsApp to log your first
                    order.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-border/80 bg-secondary/20 rounded-xl p-4 text-left space-y-3"
                    >
                      <div className="flex justify-between items-start border-b border-border/40 pb-2">
                        <div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            ID: {order.id.substring(0, 8).toUpperCase()}
                          </div>
                          <div className="text-xs font-semibold text-foreground mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans uppercase font-bold tracking-wide">
                          {order.status || "Redirected"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {item.Item || item.name || ""}{" "}
                              <span className="font-semibold text-foreground">x{item.count || item.quantity || 0}</span>
                            </span>
                            <span className="font-medium text-foreground">
                              Rs. {(item.price || 0) * (item.count || item.quantity || 0)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-dashed border-border/60 pt-2 flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">
                          Total Amount ({order.shippingRegion === "delhi_ncr" ? "Delhi NCR" : "Other"})
                        </span>
                        <span className="text-primary text-sm font-bold">Rs. {order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
