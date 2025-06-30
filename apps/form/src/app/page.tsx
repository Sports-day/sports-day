import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={6} alignItems="center">
        <Box textAlign="center">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="300">
            Welcome
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            Get started with your next project
          </Typography>
        </Box>

        <Card sx={{ width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="500">
              Quick Start
            </Typography>
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Edit{" "}
                <code
                  style={{
                    background: "#f5f5f5",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  src/app/page.tsx
                </code>{" "}
                to begin
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your changes will appear instantly
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={3}>
          <Button
            variant="contained"
            size="large"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 4, py: 1.5 }}
          >
            Documentation
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="https://github.com/vercel/next.js"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 4, py: 1.5 }}
          >
            GitHub
          </Button>
        </Stack>

        <Box
          sx={{ mt: 4, pt: 4, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Built with Next.js and Material-UI
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
