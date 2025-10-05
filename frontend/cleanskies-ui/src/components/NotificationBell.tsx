import React from "react";
import { Bell, X, AlertTriangle, Check, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

type AlertItem = {
  id: string;
  title: string;
  time?: string;
  type?: "info" | "warning" | "critical";
};


type Props = {
  hasUnread?: boolean;
};

const MOCK_ALERTS: AlertItem[] = [
  { id: "1", title: "PM2.5 levels rising in your area", time: "2 minutes ago", type: "warning" },
  { id: "2", title: "New air quality report available", time: "1 hour ago", type: "info" },
  { id: "3", title: "Sensor disconnected: Downtown station", time: "3 hours ago", type: "critical" },
];

const NotificationBell: React.FC<Props> = ({ hasUnread = false }) => {
  const [items, setItems] = React.useState<AlertItem[]>(() => MOCK_ALERTS);

  function clearAll() {
    setItems([]);
  }

  function markRead(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      {(items.length > 0 || hasUnread) && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-red-600 ring-2 ring-background">
          <span className="sr-only">You have unread notifications</span>
        </span>
      )}

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          <button
            className="text-xs text-muted-foreground"
            aria-label="Clear all"
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
          >
            Clear
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">No notifications</div>
        )}

        {items.map((a) => (
          <DropdownMenuItem key={a.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              {a.type === "critical" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : a.type === "warning" ? (
                <Bell className="h-4 w-4 text-yellow-500" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-sm font-medium">{a.title}</span>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
            <button
              aria-label={`Mark ${a.id} read`}
              className="text-xs text-muted-foreground flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                markRead(a.id);
              }}
            >
              <Check className="h-4 w-4" />
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
