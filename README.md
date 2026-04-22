# CreatorsConnect

CreatorsConnect is a full-stack marketplace designed to connect content creators with brands in the Indian market. Built as a pnpm monorepo, it features a comprehensive backend API and a dynamic React-based frontend, providing a complete platform for managing creator profiles, brand campaigns, and collaboration applications.

The platform is tailored to the Indian creator economy, with support for Indian currency formatting (Lakhs/Crores), states, languages, and region-specific social media platforms like Moj, ShareChat, and Josh.

## Core Features

-   **Creator Profiles:** Detailed profiles for creators, including social media stats, engagement rates, content categories, languages spoken, and collaboration rates.
-   **Brand Campaigns:** Brands can post campaigns with specific requirements such as budget (in INR), target audience (languages, states), minimum follower counts, and deadlines.
-   **Application System:** A complete workflow for creators to apply to campaigns and for brands to manage these applications.
-   **Comprehensive Search & Filtering:** Users can discover creators and campaigns using a wide range of filters like category, language, platform, follower count, and budget.
-   **Platform Statistics:** A dashboard providing an overview of the platform's health, including total creators, active campaigns, top-performing creators, and trending campaigns.
-   **Full CRUD Functionality:** Robust API endpoints for creating, reading, updating, and deleting creators, brands, campaigns, and applications.
-   **India-Centric Design:** Support for Indian numbering (Lakhs, Crores), all 28 states, 12 major languages, and popular local social media platforms.

## Tech Stack

-   **Monorepo:** pnpm workspaces
-   **Backend:**
    -   **Framework:** Express.js 5
    -   **Language:** TypeScript
    -   **Database:** PostgreSQL
    -   **ORM:** Drizzle ORM
    -   **Build Tool:** esbuild
-   **Frontend:**
    -   **Framework:** React 19 + Vite
    -   **UI:** Tailwind CSS, shadcn/ui components
    -   **State Management:** TanStack Query (React Query)
    -   **Routing:** wouter
-   **API & Data:**
    -   **Specification:** OpenAPI (in `openapi.yaml`)
    -   **Client Generation:** Orval to generate React Query hooks
    -   **Validation:** Zod for schema validation

## Project Structure

The repository is organized as a pnpm monorepo with three main directories: `artifacts`, `lib`, and `scripts`.

-   `artifacts/`: Contains the deployable applications.
    -   `api-server`: The Express.js backend server. It serves all `/api` routes.
    -   `creator-marketplace`: The main React frontend application.
    -   `mockup-sandbox`: A sandbox environment for previewing UI components.
-   `lib/`: Contains shared libraries and packages used across the monorepo.
    -   `api-spec`: The OpenAPI (YAML) specification which serves as the single source of truth for the API. It also contains the configuration for `orval` to auto-generate clients.
    -   `api-client-react`: Auto-generated type-safe React Query hooks for fetching data from the API.
    -   `api-zod`: Auto-generated Zod schemas for runtime data validation, derived from the OpenAPI spec.
    -   `db`: Drizzle ORM schemas, database connection logic, and migration configurations.
-   `scripts/`: Contains utility and automation scripts for the repository.

## Getting Started

### Prerequisites

-   Node.js (v24 or later)
-   pnpm (v9 or later)
-   A running PostgreSQL database instance.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ToXicK1/CreatorsConnect.git
    cd CreatorsConnect
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add your PostgreSQL connection string:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

4.  **Push database schema:**

    Apply the Drizzle ORM schema to your database. This will create all the necessary tables.
    ```bash
    pnpm --filter @workspace/db run push
    ```

### Running the Application

You need to run the API server and the frontend application in separate terminals.

1.  **Run the API Server:**
    ```bash
    pnpm --filter @workspace/api-server run dev
    ```
    The API server will be available at `http://localhost:8080`.

2.  **Run the Frontend Marketplace:**
    ```bash
    pnpm --filter @workspace/creator-marketplace run dev
    ```
    The frontend application will be available at `http://localhost:18954`.

## Available Scripts

The following scripts can be run from the root directory:

-   `pnpm install`: Installs all dependencies across the workspace.
-   `pnpm build`: Builds all packages in the correct order.
-   `pnpm typecheck`: Runs a TypeScript check on all packages.
-   `pnpm --filter @workspace/api-spec run codegen`: Regenerates the React Query hooks (`api-client-react`) and Zod schemas (`api-zod`) from the `openapi.yaml` specification. Run this after making changes to the API spec.
-   `pnpm --filter @workspace/db run push`: Pushes Drizzle schema changes to the development database.
