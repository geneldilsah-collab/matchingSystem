import Icon from '../components/Icon';

const PHASES = [
  {
    tag: 'MVP（初期リリース）', tone: 'primary', title: 'まず「探せる・更新できる」状態に',
    items: ['施設情報の登録・編集', '空室状況の更新（施設担当者もスマホから）', '入居希望者の条件登録', '地域・介護度・費用・生活保護・空室での検索', '必須条件＋希望条件によるマッチング', '管理者／相談員／施設担当者の権限管理', 'スマートフォン対応']
  },
  {
    tag: 'Phase 2', tone: 'green', title: '紹介業務をシステム上で完結',
    items: ['施設への問い合わせ・見学調整の管理', '紹介履歴・成約履歴の記録', '担当者間のメモ共有・引き継ぎ', '条件に合う空室が出たときの通知', '空室情報の更新依頼メール（自動）']
  },
  {
    tag: 'Phase 3', tone: 'amber', title: '運用データを活かして改善',
    items: ['地図表示・距離での検索', '施設写真・パンフレットの掲載', '紹介実績の分析ダッシュボード', 'CSVでの一括登録・出力', 'AIによる候補理由の文章化・面談メモ要約']
  }
];

const ROLES = [
  ['施設情報の閲覧', '○', '○', '○（全施設）'],
  ['施設情報の編集', '○', '—', '自施設のみ'],
  ['空室状況の更新', '○', '—', '自施設のみ'],
  ['入居希望者の閲覧', '○（全員）', '担当分のみ', '—（人数のみ）'],
  ['入居希望者の登録・編集', '○', '担当分のみ', '—'],
  ['マッチング・候補提示', '○', '担当分のみ', '—']
];

export default function Roadmap() {
  return (
    <div className="page">
      <section className="page-head">
        <div>
          <h1>開発計画</h1>
          <p className="muted">必要最低限の機能から始め、運用しながら段階的に機能を追加します。</p>
        </div>
      </section>

      <div className="phases">
        {PHASES.map((p) => (
          <article key={p.tag} className={`phase phase-${p.tone}`}>
            <span className="phase-tag">{p.tag}</span>
            <h3>{p.title}</h3>
            <ul>{p.items.map((i) => <li key={i}><Icon name="check" size={14} stroke={3} />{i}</li>)}</ul>
          </article>
        ))}
      </div>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title"><Icon name="shield" size={18} />権限の設計</h2>
          <div className="table-scroll">
            <table className="table simple">
              <thead><tr><th>操作</th><th>管理者</th><th>相談員</th><th>施設担当者</th></tr></thead>
              <tbody>{ROLES.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="hint"><Icon name="lock" size={14} />入居希望者の個人情報は、担当の相談員と管理者だけが閲覧できます。</p>
        </section>

        <section className="card">
          <h2 className="card-title"><Icon name="layers" size={18} />技術構成（想定）</h2>
          <div className="stack">
            <div><small>画面</small><b>React / Next.js</b><span>PC・スマホ対応のWebアプリ</span></div>
            <div><small>サーバー</small><b>Node.js または Python</b><span>検索・マッチング・権限チェック</span></div>
            <div><small>データベース</small><b>PostgreSQL</b><span>施設・空室・入居希望者・履歴</span></div>
            <div><small>認証</small><b>ログイン＋役割別の権限</b><span>通信の暗号化・操作ログの記録</span></div>
          </div>
          <p className="hint"><Icon name="clock" size={14} />このデモはブラウザ内だけで動作しています（データはお使いの端末にのみ保存）。</p>
        </section>
      </div>
    </div>
  );
}
