import { format } from "date-fns";
import { MapPin } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  ClickEvent,
  parseDeviceInfo,
  getLocation,
} from "@/lib/utils/stats-utils";

interface ClickRowProps {
  click: ClickEvent;
}

export function ClickRow({ click }: ClickRowProps) {
  const { Icon, deviceLabel, browser, os } = parseDeviceInfo(click.userAgent);

  return (
    <TableRow>
      <TableCell className="text-xs">
        {format(click.clickedAt, "MMM d, h:mm a")}
      </TableCell>
      <TableCell className="text-xs">
        <MapPin className="inline mr-1 h-3 w-3" />
        {getLocation(click)}
      </TableCell>
      <TableCell>
        <Icon className="inline mr-1 h-4 w-4" />
        {deviceLabel}
      </TableCell>
      <TableCell className="text-xs">
        <div>{browser}</div>
        <div className="text-muted-foreground">{os}</div>
      </TableCell>
      <TableCell>
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {click.ipAddress}
        </code>
      </TableCell>
    </TableRow>
  );
}
