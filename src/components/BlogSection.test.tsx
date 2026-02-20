import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogSection from "./BlogSection";

describe("BlogSection", () => {
    it("renders a section with aria-label Blog", () => {
        render(<BlogSection />);
        const section = screen.getByRole("region", { name: /blog/i });
        expect(section).toBeInTheDocument();
    });

    it("renders a visible heading (Blog or Latest)", () => {
        render(<BlogSection />);
        const heading = screen.getByRole("heading", {
            name: /^(blog|latest)$/i,
        });
        expect(heading).toBeInTheDocument();
    });

    it("shows an in-place loading state when content is not available", () => {
        render(<BlogSection />);
        expect(
            screen.getByText(/loading/i, { exact: false }),
        ).toBeInTheDocument();
    });

    it("uses semantic structure (section landmark and heading)", () => {
        render(<BlogSection />);
        const section = screen.getByRole("region", { name: /blog/i });
        const heading = section.querySelector("h2");
        expect(heading).toBeInTheDocument();
    });
});
