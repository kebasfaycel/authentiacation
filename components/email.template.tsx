import { Html } from "@react-email/html";
import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";

interface ResetPasswordEmailProps {
  resetLink: string;
}

export const ResetPasswordEmail = ({ resetLink }: ResetPasswordEmailProps) => (
  <Html>
    <Body
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <Container
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Heading style={{ color: "#333" }}>Reset Your Password</Heading>
        <Text>If you requested a password reset, click the button below:</Text>
        <Button
          pX={20}
          pY={12}
          style={{
            backgroundColor: "purple",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
            padding: "5px",
          }}
          href={resetLink}
        >
          Reset Password
        </Button>
        <Text style={{ marginTop: "20px", fontSize: "12px", color: "#888" }}>
          If you didn’t request this, just ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);
