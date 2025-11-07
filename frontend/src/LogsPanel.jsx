import React, { useEffect, useState } from "react";
import api from "./axiosConfig";

/**
 * Simple LogsPanel
 * - Fetches from /logs then /user/logs as fallback
 * - Displays Time, Email, Action, IP
 * - Read-only UI placed below user list
 */
export default function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        let res = null;
          try {
            res = await api.get("/auth/logs");
          } catch (e) {
            res = null;
          }

        if (!res) throw new Error("No logs endpoint available");
        const payload = res.data?.logs ?? res.data?.data ?? res.data;
        const list = Array.isArray(payload) ? payload : [];
        if (mounted) setLogs(list);
      } catch (err) {
        console.error("Failed to load logs:", err);
        if (mounted) setError("Không thể tải logs (kiểm tra endpoint).");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLogs();
    // optional: refresh every 30s
    const interval = setInterval(fetchLogs, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ marginBottom: 8 }}>📜 Activity Logs</h3>

      <div style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        maxHeight: 320,
        overflow: "auto"
      }}>
        {loading && <div>Đang tải logs...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && logs.length === 0 && <div>Chưa có logs.</div>}

        {!loading && !error && logs.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e6e9ee" }}>
                <th style={{ padding: "8px 6px", width: 180 }}>Thời gian</th>
                <th style={{ padding: "8px 6px", width: 220 }}>Email</th>
                <th style={{ padding: "8px 6px" }}>Action</th>
                <th style={{ padding: "8px 6px", width: 140 }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, idx) => {
                // support different log shapes
                const time = l.createdAt;
                const email =  l.userId ?? "-";
                const action = l.action ?? "-";
                const ip = l.ip ?? "-";
                const timeStr = time ? new Date(time).toLocaleString() : "-";
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "8px 6px", color: "#374151" }}>{timeStr}</td>
                    <td style={{ padding: "8px 6px", color: "#0b1226" }}>{email}</td>
                    <td style={{ padding: "8px 6px", color: "#374151" }}>{action}</td>
                    <td style={{ padding: "8px 6px", color: "#374151" }}>{ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}