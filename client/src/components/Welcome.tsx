import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePen,
  faFileCirclePlus,
  faUserGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import { Card, Badge } from "../ui";

interface ActionTileProps {
  to: string;
  icon: typeof faFilePen;
  title: string;
  description: string;
  tone: "primary" | "secondary";
}

const toneMap = {
  primary: {
    iconWrap: "bg-primary-500/15 text-primary-300 border-primary-400/30",
    arrow: "text-primary-300 group-hover:text-primary-200",
  },
  secondary: {
    iconWrap: "bg-secondary-500/15 text-secondary-300 border-secondary-400/30",
    arrow: "text-secondary-300 group-hover:text-secondary-200",
  },
};

const ActionTile = ({ to, icon, title, description, tone }: ActionTileProps) => {
  const t = toneMap[tone];
  return (
    <Link
      to={to}
      className="group surface-card p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
    >
      <span
        className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg ${t.iconWrap}`}
      >
        <FontAwesomeIcon icon={icon} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ink-100 group-hover:text-white">
          {title}
        </div>
        <div className="text-sm text-ink-400 truncate">{description}</div>
      </div>
      <span
        className={`text-xl transition-transform group-hover:translate-x-1 ${t.arrow}`}
      >
        →
      </span>
    </Link>
  );
};

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const { username, isAdmin, isManager } = useAuth();

  return (
    <section className="space-y-8">
      <Card>
        <Badge tone="primary" dot className="mb-4">
          Dashboard
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Welcome back,{" "}
          <span className="bg-linear-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            {username || "Guest"}
          </span>
        </h1>
        <p className="mt-2 text-sm text-ink-400">{today}</p>
      </Card>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-400 mb-4">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ActionTile
            to="/dash/notes"
            icon={faFilePen}
            title="View techNotes"
            description="Browse open & completed tickets"
            tone="primary"
          />
          <ActionTile
            to="/dash/notes/new"
            icon={faFileCirclePlus}
            title="Add new techNote"
            description="Create a repair ticket"
            tone="secondary"
          />

          {(isAdmin || isManager) && (
            <ActionTile
              to="/dash/users"
              icon={faUserGear}
              title="View user settings"
              description="Manage staff accounts & roles"
              tone="primary"
            />
          )}
          {(isAdmin || isManager) && (
            <ActionTile
              to="/dash/users/new"
              icon={faUserPlus}
              title="Add new user"
              description="Provision a new employee"
              tone="secondary"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Welcome;