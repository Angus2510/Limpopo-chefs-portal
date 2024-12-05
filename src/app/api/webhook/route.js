import { fetchRoles } from '@/config/pagesAccess';

export const POST = async (req) => {
  try {
    // Refetch roles
    const updatedRoles = await fetchRoles();

    // Optionally, you can save the updatedRoles to a cache or state
    // setRolesData(updatedRoles);

    return new Response(JSON.stringify({ message: 'Roles updated successfully.', updatedRoles }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to update roles.', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const GET = (req) => {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      'Allow': 'POST',
    },
  });
};
