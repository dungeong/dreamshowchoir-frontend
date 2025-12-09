export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600">관리자 페이지에 오신 것을 환영합니다.</p>
                <p className="text-sm text-gray-500 mt-2">좌측 메뉴를 통해 사이트를 관리할 수 있습니다.</p>
            </div>
        </div>
    );
}
