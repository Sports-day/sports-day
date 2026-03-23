// src/App.tsx
import { useEffect, useState } from "react";
import { User } from "oidc-client-ts";
import { userManager } from "./authentication";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/callback") {
      userManager
        .signinRedirectCallback()
        .then((user) => {
          setUser(user);
          window.history.replaceState({}, "", "/");
        })
        .catch(console.error)
        .finally(() => setLoading(false));
      return;
    }

    userManager
      .signinSilent()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    userManager.events.addUserLoaded(setUser);
    return () => userManager.events.removeUserLoaded(setUser);
  }, []);

  if (loading) return <div>読み込み中...</div>;

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

  return (
    <div>
      <h1>認証成功!</h1>

      <h2>ユーザー情報</h2>
      <pre>{JSON.stringify(user.profile, null, 2)}</pre>

      <h2>Access Token</h2>
      <textarea
        readOnly
        value={user.access_token}
        rows={10}
        style={{ width: "100%", fontFamily: "monospace", fontSize: "12px" }}
      />
      <p>
        <small>↑ この AT をコピーして Backend のテストに使う（Phase 2）</small>
      </p>

      <h2>ID Token</h2>
      <pre style={{ fontSize: "12px", wordBreak: "break-all" }}>
        {user.id_token}
      </pre>

      <h2>トークン有効期限</h2>
      <p>期限切れまで: {user.expires_in} 秒</p>

      <button onClick={() => userManager.signoutRedirect()}>ログアウト</button>
    </div>
  );
}

export default App;
