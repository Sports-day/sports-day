// src/Home.tsx
import { useEffect, useState } from "react";
import { User } from "oidc-client-ts";
import { userManager } from "./authentication";

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userManager
      .signinSilent()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    userManager.events.addUserLoaded(setUser);
    return () => userManager.events.removeUserLoaded(setUser);
  }, []);

  const testBackend = async () => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ query: '{ me { id name email } }' }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log('Backend response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Backend error:', err);
      alert(`Error: ${err}`);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return (
    <div style={{ color: "red" }}>
      <h1>認証エラー</h1>
      <pre>{error}</pre>
      <button onClick={() => { setError(null); setUser(null); }}>戻る</button>
    </div>
  );

  // ログインしていない時
  if (!user) {
    return (
      <div>
        <h1>認証プロトタイプ</h1>
        <button onClick={() => userManager.signinRedirect()}>
          Keycloak でログイン
        </button>
      </div>
    );
  }

  // ログイン成功時
  return (
    <div>
       <h1>認証成功!</h1>
       <h2>ユーザー情報</h2>
       <pre>{JSON.stringify(user.profile, null, 2)}</pre>
       <h2>Access Token</h2>
       <textarea readOnly value={user.access_token} rows={10} style={{ width: "100%", fontFamily: "monospace", fontSize: "12px" }} />
       <p><small>↑ この AT をコピーして Backend のテストに使う（Phase 2）</small></p>
       <h2>ID Token</h2>
       <pre style={{ fontSize: "12px", wordBreak: "break-all" }}>{user.id_token}</pre>
       <h2>トークン有効期限</h2>
       <p>期限切れまで: {user.expires_in} 秒</p>
       <div style={{ marginBottom: "20px" }}>
         <button onClick={testBackend} style={{ marginRight: "10px", padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
           Backendをテスト
         </button>
         <button onClick={() => userManager.signoutRedirect()} style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
           ログアウト
         </button>
       </div>
    </div>
  );
}

export default Home;
