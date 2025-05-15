interface UserDetailModalProps {
    user: {
        id: string;
        name: string;
        email: string;
        grade: string;
        city: string;
        lastActive: string;
        status: string;
    };
    onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
            <div className="bg-white rounded-xl rounded-tr-[0px] rounded-br-[0px] shadow-lg p-6 w-[40vw] min-w-[320px] absolute right-0 h-[100vh] overflow-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                >
                    &times;
                </button>
                <div className="flex flex-col items-center gap-4">
                    <img
                        src="https://i.pravatar.cc/100?u=student-avatar"
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.grade}</p>
                    </div>

                    {/* Personal Information */}
                    <div className="w-full bg-indigo-50 rounded-lg p-4 mt-4">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">Personal Information</h3>
                        <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-2">
                            <div>
                                <span className="font-medium">Age:</span> 16
                            </div>
                            <div>
                                <span className="font-medium">School:</span> Lycée Parisien
                            </div>
                            <div>
                                <span className="font-medium">City:</span> {user.city}
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="w-full border-t border-gray-200 py-4">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">Contact Details</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>
                                <span className="font-medium">Email:</span> {user.email}
                            </div>
                            <div>
                                <span className="font-medium">Phone:</span> +33 291920101010
                            </div>
                        </div>
                    </div>

                    {/* Academic Progress */}
                    <div className="w-full bg-indigo-50 rounded-lg p-4 mt-2">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">Academic Progress</h3>
                        {[
                            { label: 'Overall Progress', value: 91 },
                            { label: 'Algebra', value: 60 },
                            { label: 'Science', value: 80 },
                            { label: 'English', value: 30 },
                        ].map((item) => (
                            <div key={item.label} className="mb-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Exercise & Assessment Results */}
                    <div className="w-full py-4">
                        <h3 className="text-sm font-semibold mb-2 text-gray-700">
                            Exercise & Assessment Results
                        </h3>
                        {[
                            { label: 'Mathematics', value: 90 },
                            { label: 'Science', value: 65 },
                            { label: 'French', value: 69 },
                        ].map((item) => (
                            <div key={item.label} className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>
                                        {item.label}
                                        <span className="text-gray-400 ml-1 text-[11px]">
                                            Last Attempt: March 10, 2025
                                        </span>
                                    </span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex w-full justify-between mt-auto pt-4 border-t">
                        <button className="text-sm border px-4 py-1.5 rounded text-gray-600 flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Weekly Report
                        </button>
                        <button className="text-sm bg-indigo-500 text-white px-4 py-1.5 rounded flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Export
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-700';
        case 'Pending':
            return 'bg-orange-100 text-orange-700';
        case 'Canceled':
        case 'Inactive':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}
