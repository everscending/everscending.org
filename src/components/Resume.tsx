import { Link } from "react-router-dom";
import "./Resume.scss";

const Resume = () => {
    return (
        <div id="resume" className="outer-container">
            <div id="inner-container">
                <div className="header-icon">
                    <img
                        src="/seed-of-life-dark.svg"
                        width="75"
                        alt="seed of life"
                    />
                </div>
                <div className="header-contact-left">
                    <h1>Jordan Phillips</h1>
                    <p>Full-Stack Software Engineer</p>
                </div>
                <div className="header-contact-right">
                    (512) 888-4038
                    <br />
                    <a href="mailto:everscending@gmail.com">
                        everscending@gmail.com
                    </a>
                </div>

                <div style={{ clear: "both" }}></div>

                <h2>Summary</h2>
                <p>
                    Seasoned{" "}
                    <span className="bold">Full-Stack Software Engineer</span>{" "}
                    with 30+ years of app development within
                    <i> healthcare</i>, <i>banking</i>, <i>education</i>,{" "}
                    <i>non-profit</i>, and <i>e-commerce</i> industries.
                    Building upon decades of experience in delivering
                    sophisticated SaaS solutions and leading with empathy, I am
                    now expanding my fluency in agentic AI engineering to build
                    the next generation of technologies that drive meaningful
                    impact.
                </p>

                <h2>Technical Skills</h2>
                <p className="technical-skills">
                    Agentic Coding, Typescript, React, HTML/CSS/Sass, A11y,
                    Playwright, Cypress, PHP/Laravel, Python, MySQL/Oracle,
                    GraphQL, Perl, Shell scripting, *nix system administration,
                    Git, AWS, Azure App Insights / Kusto, New Relic, CICD,
                    performance monitoring & logging, vulnerability remediation,
                    Mermaid diagramming, and many others.
                </p>

                <h2>Professional Experience</h2>

                <div className="experience-heading">
                    <div className="years">2017 - 2025</div>
                    <h3>Senior/Lead Member of Technical Staff</h3>,
                    athenahealth, Austin, Tx
                </div>
                <ul>
                    <li>
                        Developed features and remediated bugs in UX workflows
                        for clinicians and patients
                    </li>
                    <li>
                        Contributed on multiple teams and products using diverse
                        technologies/frameworks
                    </li>
                    <li>
                        Bootstrapped athenahealth's Telehealth service during
                        COVID and subsequently overhauled its internals to
                        enhance reliability and scalability.
                    </li>
                    <li>Onboarded and mentored junior engineers</li>
                    <li>
                        Supported production systems during on-call rotation and
                        client escalations
                    </li>
                    <li>
                        Embraced emerging AI coding tools (GitHub Copilot,
                        Windsurf/Cascade) to enhance productivity and code
                        quality while honing skills in framing complex problems,
                        LLM prompting, and evaluating AI-generated code
                    </li>
                </ul>

                <div className="experience-heading">
                    <div className="years">2015 - 2017</div>
                    <h3>Technical Lead</h3>, Sapling Learning, Austin, Tx
                </div>
                <ul>
                    <li>
                        Feature dev and bug fixes in Sapling Learning's flagship
                        online homework product
                    </li>
                    <li>Maintained and improved RESTful APIs in Node.js</li>
                    <li>
                        Performed static code analysis and remediated security
                        flaws using Veracode
                    </li>
                    <li>Refactored aging UX to meet a11y standards</li>
                </ul>

                <div className="experience-heading">
                    <div className="years">2014 - 2015</div>
                    <h3>Software Engineer</h3>, BancVue, Austin, Tx
                </div>
                <ul>
                    <li>
                        Leveraged Test Driven Development to ensure bullet-proof
                        code in banking applications
                    </li>
                    <li>
                        Developed features and remediated bugs in internal
                        tools, service endpoints, and client-facing applications
                        written in PHP, Google Closure, jQuery, and Flash
                    </li>
                </ul>

                <div className="experience-heading">
                    <div className="years">2010 - 2014</div>
                    <h3>Technical Lead / eCommerce Software Engineer</h3>,
                    Balfour, Austin, Tx
                </div>
                <ul>
                    <li>
                        Customized Magento eCommerce platform to accommodate
                        specialized products, check-out, and reporting workflows
                        eliminating multiple product websites and unifying
                        company's online brand under one shopping cart.
                    </li>
                    <li>
                        Onboarded and mentored junior devs w/ guidance on best
                        practices &amp; code reviews
                    </li>
                    <li>
                        Implemented and managed CICD pipelines using Git,
                        Jenkins, and AWS
                    </li>
                    <li>
                        Optimized performance of Apache/MySQL to increase online
                        traffic capacity
                    </li>
                </ul>

                <p className="to-see-more">
                    To see more detailed career history, visit{" "}
                    <strong>
                        <a href="https://www.linkedin.com/in/jordaneverscending/">
                            https://www.linkedin.com/in/jordaneverscending/
                        </a>
                    </strong>
                </p>
            </div>

            <div id="footer">
                <Link to="/" className="back-link">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Resume;
