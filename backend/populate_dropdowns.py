import os
import django
import sys

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import Region, Team

def populate_dropdowns():
    print("Populating Regions and Teams...")
    
    new_regions = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata']
    new_teams = ['Sales Team A', 'Sales Team B', 'Operations Team', 'Support Team', 'Retail Team', 'Enterprise Team']
    
    # 1. Create Regions
    region_objs = {}
    for name in new_regions:
        region, created = Region.objects.get_or_create(name=name)
        region_objs[name] = region
        if created:
            print(f"Created region: {name}")
    
    # 2. Create Teams (Associating them with the first region for simplicity if needed, 
    # but I'll distribute them if possible. Let's just use Mumbai as default for now)
    default_region = region_objs['Mumbai']
    
    for name in new_teams:
        team, created = Team.objects.get_or_create(name=name, region=default_region)
        if created:
            print(f"Created team: {name} in {default_region.name}")

    print("Populating completed.")

if __name__ == "__main__":
    populate_dropdowns()
