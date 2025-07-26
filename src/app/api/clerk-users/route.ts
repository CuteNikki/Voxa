import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json({ error: 'Missing ids' }, { status: 400 });
  }

  const userIds = idsParam.split(',');

  try {
    const results = await Promise.all(
      userIds.map((id) =>
        fetch(`https://api.clerk.com/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }).then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch user ${id}`);
          return res.json();
        }),
      ),
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
