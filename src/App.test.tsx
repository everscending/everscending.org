import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import * as blogApi from "./utils/blogApi";

vi.mock("./utils/blogApi", async (importOriginal) => {
    const actual = await importOriginal<typeof import("./utils/blogApi")>();
    return {
        ...actual,
        fetchBlogPosts: vi.fn().mockResolvedValue({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        }),
    };
});

const testQueryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

function renderApp() {
    return render(
        <QueryClientProvider client={testQueryClient}>
            <App />
        </QueryClientProvider>,
    );
}

describe("App", () => {
    beforeEach(() => {
        // Ensure clean state before each test
        cleanup();
        // Reset window.history to initial state
        window.history.pushState({}, "", "/");
        vi.mocked(blogApi.fetchBlogPosts).mockResolvedValue({
            ok: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
    });

    it("renders without crashing", async () => {
        renderApp();
        await screen.findByRole("region", { name: /blog/i });
    });

    it("renders the home page by default", async () => {
        renderApp();
        await screen.findByRole("region", { name: /blog/i });
        expect(screen.getByText("AI Engineering Path")).toBeInTheDocument();
        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(screen.getByText("Resume")).toBeInTheDocument();
        expect(
            screen.getByRole("region", { name: /blog/i }),
        ).toBeInTheDocument();
    });

    it("navigates to resume page when clicked", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByRole("region", { name: /blog/i });

        // Click on the Resume link
        const resumeLink = screen.getByRole("link", { name: /resume/i });
        await user.click(resumeLink);

        // Verify Resume page content is displayed
        await waitFor(() => {
            expect(screen.getByText("Technical Skills")).toBeInTheDocument();
        });
        expect(screen.getByText("Professional Experience")).toBeInTheDocument();
    });

    it("navigates to projects page when clicked", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByRole("region", { name: /blog/i });

        const projectsLink = screen.getByRole("link", { name: /projects/i });
        await user.click(projectsLink);

        await waitFor(() => {
            expect(
                screen.getByRole("link", { name: /agentic digital twin/i }),
            ).toBeInTheDocument();
        });
    });

    it("navigates to ai-engineering-path page when clicked", async () => {
        const user = userEvent.setup();
        renderApp();
        await screen.findByRole("region", { name: /blog/i });

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
        renderApp();
        await screen.findByRole("region", { name: /blog/i });

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
