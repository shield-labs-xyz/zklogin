import { type QueryClient } from "@tanstack/svelte-query";

export class QueriesService {
  constructor(
    /**
     * # For use only in provider
     */
    readonly queryClient: QueryClient,
  ) {}

  async invalidateAll() {
    await this.queryClient.invalidateQueries();
  }
}
