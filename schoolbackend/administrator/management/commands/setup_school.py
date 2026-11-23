import getpass
from django.core.management.base import BaseCommand
from administrator.models import SchoolConfig, User


class Command(BaseCommand):
    help = "Initialize or update school branding configuration and default admin account."

    def add_arguments(self, parser):
        parser.add_argument("--name", type=str, help="Full school name")
        parser.add_argument("--short-name", type=str, help="Short school name / acronym")
        parser.add_argument("--tagline", type=str, help="School motto or tagline")
        parser.add_argument("--address", type=str, help="School address")
        parser.add_argument("--phone", type=str, help="School phone number")
        parser.add_argument("--email", type=str, help="School contact email")
        parser.add_argument("--admin-username", type=str, help="Admin username")
        parser.add_argument("--admin-email", type=str, help="Admin email")
        parser.add_argument("--admin-password", type=str, help="Admin password")
        parser.add_argument("--currency-code", type=str, default="NGN", help="Currency code (e.g. NGN, USD, GBP)")
        parser.add_argument("--currency-symbol", type=str, default="₦", help="Currency symbol (e.g. ₦, $, £)")
        parser.add_argument("--non-interactive", action="store_true", help="Do not prompt for missing values")

    def handle(self, *args, **options):
        non_interactive = options["non_interactive"]

        self.stdout.write(self.style.MIGRATE_HEADING("=== School Setup & Customization ==="))

        config = SchoolConfig.get_solo()

        # School Name
        name = options["name"]
        if not name:
            if non_interactive:
                name = config.name or "School Management Portal"
            else:
                default_name = config.name or "My School"
                name = input(f"Enter School Name [{default_name}]: ").strip() or default_name
        config.name = name

        # Tagline
        tagline = options["tagline"]
        if not tagline and not non_interactive:
            tagline = input(f"Enter Tagline [{config.tagline}]: ").strip() or config.tagline
        if tagline:
            config.tagline = tagline

        # Short Name
        short_name = options["short_name"]
        if not short_name and not non_interactive:
            default_short = config.short_name or "".join(word[0] for word in name.split() if word)[:6].upper()
            short_name = input(f"Enter Short Name / Acronym [{default_short}]: ").strip() or default_short
        if short_name:
            config.short_name = short_name

        # Address
        address = options["address"]
        if not address and not non_interactive:
            address = input(f"Enter School Address [{config.address}]: ").strip() or config.address
        if address:
            config.address = address

        # Phone
        phone = options["phone"]
        if not phone and not non_interactive:
            phone = input(f"Enter Contact Phone [{config.phone}]: ").strip() or config.phone
        if phone:
            config.phone = phone

        # Contact Email
        email = options["email"]
        if not email and not non_interactive:
            email = input(f"Enter School Email [{config.email}]: ").strip() or config.email
        if email:
            config.email = email

        if options.get("currency_code"):
            config.currency_code = options["currency_code"]
        if options.get("currency_symbol"):
            config.currency_symbol = options["currency_symbol"]

        config.save()
        self.stdout.write(self.style.SUCCESS(f"✓ Configured school: {config.name} ({config.short_name})"))

        # Setup Admin User
        admin_username = options["admin_username"]
        if not admin_username and not non_interactive:
            admin_username = input("Enter Administrator Username [admin]: ").strip() or "admin"
        elif not admin_username:
            admin_username = "admin"

        admin_email = options["admin_email"]
        if not admin_email and not non_interactive:
            default_admin_email = config.email or "admin@school.com"
            admin_email = input(f"Enter Administrator Email [{default_admin_email}]: ").strip() or default_admin_email
        elif not admin_email:
            admin_email = config.email or "admin@school.com"

        admin_password = options["admin_password"]
        if not admin_password and not non_interactive:
            while not admin_password:
                admin_password = getpass.getpass("Enter Administrator Password: ").strip()
                if not admin_password:
                    self.stdout.write(self.style.WARNING("Password cannot be empty."))

        user = User.objects.filter(username=admin_username).first()
        if user:
            user.role = User.Role.ADMIN
            user.is_staff = True
            user.is_superuser = True
            if admin_email:
                user.email = admin_email
            if admin_password:
                user.set_password(admin_password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"✓ Updated existing admin account '{admin_username}'"))
        else:
            if not admin_password:
                admin_password = "adminpassword123"
                self.stdout.write(self.style.WARNING(f"Generated default password '{admin_password}'"))
            user = User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password,
                role=User.Role.ADMIN,
            )
            self.stdout.write(self.style.SUCCESS(f"✓ Created new admin user '{admin_username}'"))

        self.stdout.write(self.style.SUCCESS("\nSetup complete! You can now start the server."))
