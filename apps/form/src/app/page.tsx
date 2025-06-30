"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";

const Query = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(Query);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users: {error.message}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Box textAlign="center">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="300">
            Users
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            {data?.users?.length || 0} users found
          </Typography>
        </Box>

        <Card sx={{ width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="500">
              User List
            </Typography>

            {data?.users?.length > 0 ? (
              <List sx={{ mt: 2 }}>
                {data.users.map((user: any) => (
                  <ListItem
                    key={user.id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      mb: 2,
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                          >
                            ID: {user.id}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                          >
                            Email: {user.email}
                          </Typography>
                        </>
                      }
                    />
                    <Chip label="Active" color="success" size="small" />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No users found
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.reload()}
            sx={{ px: 4, py: 1.5 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 4, py: 1.5 }}
          >
            Documentation
          </Button>
        </Stack>

        <Box
          sx={{ mt: 4, pt: 4, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Built with Next.js, Material-UI and Apollo GraphQL
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
