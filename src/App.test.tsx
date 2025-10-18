import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
    beforeEach(() => {
        // Ensure clean state before each test
        cleanup();
        // Reset window.history to initial state
        window.history.pushState({}, "", "/");
    });

    it("renders without crashing", () => {
        render(<App />);
    });

    it("renders the home page by default", () => {
        render(<App />);
        expect(screen.getByText("AI Engineering Path")).toBeInTheDocument();
        expect(screen.getByText("Agentic Digital Twin")).toBeInTheDocument();
        expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("navigates to resume page when clicked", async () => {
        const user = userEvent.setup();
        render(<App />);

        // Click on the Resume link
        const resumeLink = screen.getByRole("link", { name: /resume/i });
        await user.click(resumeLink);

        // Verify Resume page content is displayed
        await waitFor(() => {
            expect(screen.getByText("Technical Skills")).toBeInTheDocument();
        });
        expect(screen.getByText("Professional Experience")).toBeInTheDocument();
    });

    it("navigates to agentic-twin page when clicked", async () => {
        const user = userEvent.setup();
        render(<App />);

        // Click on the Agentic Digital Twin link
        const agenticLink = screen.getByRole("link", {
            name: /agentic digital twin/i,
        });
        await user.click(agenticLink);

        // Verify AgenticTwin page content is displayed
        await waitFor(() => {
            expect(
                screen.getByText("Welcome to my Agentic Digital Twin"),
            ).toBeInTheDocument();
        });
    });

    it("navigates to ai-engineering-path page when clicked", async () => {
        const user = userEvent.setup();
        render(<App />);

        // Click on the AI Engineering Path link
        const aiEngineeringLink = screen.getByRole("link", {
            name: /ai engineering path/i,
        });
        await user.click(aiEngineeringLink);

        // Verify AIEngineeringPath page content is displayed
        await waitFor(() => {
            expect(
                screen.getByText("AI Engineering Learning Path"),
            ).toBeInTheDocument();
        });
    });

    it("navigates back to home from resume page", async () => {
        const user = userEvent.setup();
        render(<App />);

        // Navigate to resume
        const resumeLink = screen.getByRole("link", { name: /resume/i });
        await user.click(resumeLink);

        await waitFor(() => {
            expect(screen.getByText("Jordan Phillips")).toBeInTheDocument();
        });

        // Click back to home
        const backLink = screen.getByRole("link", { name: /back to home/i });
        await user.click(backLink);

        // Verify we're back on home page
        await waitFor(() => {
            expect(screen.getByText("AI Engineering Path")).toBeInTheDocument();
        });
    });

    // it("has correct route structure", () => {
    //     const { container } = render(<App />);
    //     expect(container.querySelector(".App")).toBeInTheDocument();
    // });
});
