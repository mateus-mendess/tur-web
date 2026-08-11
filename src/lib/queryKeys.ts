export const queryKeys = {
  spots: {
    all: ['spots'] as const,
    detail: (id: string) => ['spots', id] as const,
  },
  categories: ['categories'] as const,
  accessibilityTypes: ['accessibility-types'] as const,
  states: ['states'] as const,
  comments: (touristPointId: string) => ['comments', touristPointId] as const,
}
