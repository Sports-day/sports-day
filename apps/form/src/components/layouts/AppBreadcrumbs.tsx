import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type AppBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function AppBreadcrumbs({ items }: AppBreadcrumbsProps) {
  const theme = useTheme();
  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (!item.href || isLast) {
          return (
            <Typography
              key={`${item.label}-${index}`}
              sx={{ color: theme.typography.firstFont.color }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={`${item.label}-${index}`}
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
