import { Search } from "lucide-react";

export function SubscribersTab({
  subscriberSearch,
  setSubscriberSearch,
  subscriberPage,
  setSubscriberPage,
  subscribers,
  subscribersData,
  loadingSubscribers,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search by email..."
            value={subscriberSearch}
            onChange={(e) => {
              setSubscriberSearch(e.target.value);
              setSubscriberPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border-2 border-[#E5E7EB] rounded-lg focus:border-[#E91E8C] outline-none"
          />
        </div>
      </div>
      {loadingSubscribers ? (
        <p className="text-[#6B7280] py-8">Loading subscribers...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">Email</th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">
                  Subscribed
                </th>
                <th className="text-left py-3 px-2 text-[#374151] font-semibold">
                  Account
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#6B7280]">
                    No subscribers yet. They will appear when users subscribe via “Get
                    Floral Updates” on the home page.
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#FFF5F7]/50"
                  >
                    <td className="py-3 px-2">{s.email}</td>
                    <td className="py-3 px-2 text-[#6B7280]">
                      {s.subscribed_at
                        ? new Date(s.subscribed_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 px-2 text-[#6B7280]">
                      {s.user ? s.user.name : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {subscribersData && subscribersData.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setSubscriberPage((p) => Math.max(1, p - 1))}
            disabled={subscriberPage <= 1}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[#6B7280]">
            Page {subscriberPage} of {subscribersData.last_page}
          </span>
          <button
            type="button"
            onClick={() => setSubscriberPage((p) => p + 1)}
            disabled={subscriberPage >= subscribersData.last_page}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
