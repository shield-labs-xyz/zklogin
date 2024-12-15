import type { zklogin } from "@shield-labs/zklogin";
import { createQuery, type QueryClient } from "@tanstack/svelte-query";

export class QueriesService {
  constructor(
    readonly authProvider: zklogin.GoogleProvider,
    /**
     * # For use only in provider
     */
    readonly queryClient: QueryClient,
  ) {}

  jwt() {
    return createQuery(
      {
        queryKey: ["jwt"],
        queryFn: async () => (await this.authProvider.getJwt()) ?? null,
      },
      this.queryClient,
    );
  }

  async invalidateAll() {
    await this.queryClient.invalidateQueries();
  }
}
