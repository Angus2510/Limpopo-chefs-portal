import prisma from "@/lib/prisma"; // Adjust the path as needed

export interface Access {
  types: string[];
  roles: string[];
  userIds: string[];
  actions: {
    view?: string[];
    edit?: string[];
    upload?: string[];
  };
}

export const fetchRoles = async (): Promise<
  { [key: string]: Access } | undefined
> => {
  try {
    const roles = await prisma.roles.findMany({
      include: {
        permissions: true, // Include related permissions
      },
    });

    const pagesAccess: { [key: string]: Access } = roles.reduce(
      (acc: { [key: string]: Access }, role) => {
        const permissions = role.permissions as {
          id: string;
          page: string;
          actions: {
            edit: boolean;
            upload: boolean;
            view: boolean;
          };
        }[];

        acc[role.roleName] = {
          types: permissions.map((perm) => perm.page), // Use 'page' as 'type'
          roles: [role.roleName],
          userIds: [], // Populate this based on your requirements
          actions: {
            view: permissions
              .filter((perm) => perm.actions.view)
              .map((perm) => perm.page),
            edit: permissions
              .filter((perm) => perm.actions.edit)
              .map((perm) => perm.page),
            upload: permissions
              .filter((perm) => perm.actions.upload)
              .map((perm) => perm.page),
          },
        };

        return acc;
      },
      {}
    );

    return pagesAccess;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return undefined;
  }
};
