// components/admin/UserDetailView.tsx
import { X, MapPin, Calendar, Smartphone, ShieldCheck, Trash2, UserX } from 'lucide-react';

export default function UserDetailView({ user, onClose }: { user: any, onClose: () => void }) {
    if (!user) return null;
    const calculateAge = (dobString: string) => {
        console.log(dobString);
        if (!dobString) return "N/A";
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{user.username || 'Profile Detail'}</h2>
                    <p className="text-xs text-slate-500 font-mono">{user.id}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Profile Picture Section */}
                <section className='flex flex-row items-start gap-x-3'>
                    <div className="flex- 1relative group">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Profile Photo</h3>

                        {user.photoURL ? (
                            <div className="relative w-32 h-32 overflow-hidden rounded-full border border-slate-200 shadow-inner bg-slate-100">
                                <img
                                    src={user.photoURL}
                                    alt={`${user.displayName}'s profile`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + (user.displayName || "User") + "&background=random";
                                    }}
                                />
                                {/* Verification Badge Overlay */}
                                {user.isVerified && (
                                    <div className="absolute top-3 right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
                                        <ShieldCheck size={16} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-32 w-full rounded-xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                <UserX size={40} strokeWidth={1} />
                                <p className="text-xs mt-2 font-medium">No profile photo set</p>
                            </div>
                        )}
                    </div>

                    {/* Bio & Details */}
                    <section className=" flex-1 space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Bio</h3>
                            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-sm leading-relaxed border border-slate-100">
                                {user.bio || "This user hasn't written a bio yet."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Age / DOB</span>
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Calendar size={16} className="text-pink-500" />
                                    <span>{calculateAge(user.dob) ?? 'N/A'} yo</span>
                                </div>
                                <span className="text-slate-400 text-xs">({user.dob})</span>

                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Smartphone size={16} className="text-slate-400" />
                                <span className="capitalize">OS: {user.platform || 'Legacy'}</span>
                            </div>
                        </div>
                    </section>
                </section>

                <section className='mt-4'>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Uploaded Photos</h3>

                    <div className="relative group">
                        <div className="relative">
                            {user.images && user.images.length > 0 ? (
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {user.images.map((image: string, index: number) => (
                                        <div
                                            key={index}
                                            className="relative size-32 overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100"
                                        >
                                            <img
                                                src={image}
                                                alt={`${user.displayName}'s upload ${index + 1}`}
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`;
                                                }}
                                            />

                                            {/* Verification Badge - usually only show on the first image or if verified */}
                                            {user.isVerified && index === 0 && (
                                                <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                                                    <ShieldCheck size={12} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-40 w-full mt-5 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                    <UserX size={32} strokeWidth={1} />
                                    <p className="text-xs mt-2 font-medium">No photos uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>



                {/* Admin Actions */}
                <section className="pt-6 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Moderation Tools</h3>
                    <button className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white py-2.5 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                        <ShieldCheck size={18} />
                        Verify Identity
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                        Ban Account
                    </button>
                </section>
            </div>
        </div>
    );
}