"""empty message

Revision ID: 34ba928eebf2
Revises: 
Create Date: 2024-05-07 20:54:36.999572

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '34ba928eebf2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('event_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('image', sa.String(length=250), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('event',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('owner_id', sa.BigInteger(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('location', sa.String(length=250), nullable=False),
    sa.Column('location_name', sa.String(length=250), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('start_datetime', sa.DateTime(timezone=True), nullable=False),
    sa.Column('end_datetime', sa.DateTime(timezone=True), nullable=True),
    sa.Column('status', sa.Enum('Planned', 'Completed', 'Canceled', 'In Progress', name='status'), nullable=False),
    sa.Column('description', sa.String(length=250), nullable=True),
    sa.Column('budget_per_person', sa.Float(), nullable=True),
    sa.Column('event_type_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['event_type_id'], ['event_type.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user__profile',
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('last_name', sa.String(length=120), nullable=False),
    sa.Column('birthdate', sa.Date(), nullable=False),
    sa.Column('location', sa.String(length=250), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=False),
    sa.Column('profile_image', sa.String(length=250), nullable=False),
    sa.Column('cover_image', sa.String(length=250), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id')
    )
    op.create_table('user_profile_image',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('image_path', sa.String(length=250), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('event__member',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('event_id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('member_status', sa.Enum('Applied', 'Owner', 'Accepted', 'Rejected', name='member_status'), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['event.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('favorite',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('event_id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['event.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('group_chat',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('event_id', sa.BigInteger(), nullable=False),
    sa.Column('createdAt', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['event.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('private_chat',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('event_id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('createdAt', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['event.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('private_chat_id', sa.BigInteger(), nullable=True),
    sa.Column('group_chat_id', sa.BigInteger(), nullable=True),
    sa.Column('sender_id', sa.BigInteger(), nullable=False),
    sa.Column('receiver_id', sa.BigInteger(), nullable=True),
    sa.Column('message', sa.String(length=250), nullable=False),
    sa.Column('group_type', sa.Enum('Private', 'Group', name='group_type'), nullable=False),
    sa.Column('sentAt', sa.DateTime(timezone=True), nullable=False),
    sa.Column('deliveredAt', sa.DateTime(timezone=True), nullable=True),
    sa.Column('readAt', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['group_chat_id'], ['group_chat.id'], ),
    sa.ForeignKeyConstraint(['private_chat_id'], ['private_chat.id'], ),
    sa.ForeignKeyConstraint(['receiver_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users_group_chat',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('chat_id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['chat_id'], ['group_chat.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users_private_chat',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('chat_id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['chat_id'], ['private_chat.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users_private_chat')
    op.drop_table('users_group_chat')
    op.drop_table('message')
    op.drop_table('private_chat')
    op.drop_table('group_chat')
    op.drop_table('favorite')
    op.drop_table('event__member')
    op.drop_table('user_profile_image')
    op.drop_table('user__profile')
    op.drop_table('event')
    op.drop_table('user')
    op.drop_table('event_type')
    # ### end Alembic commands ###
