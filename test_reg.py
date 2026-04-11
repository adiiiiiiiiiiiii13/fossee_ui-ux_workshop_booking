import urllib.request
import urllib.parse
import sys

data = {
    'username': 'adi514',
    'email': 'adi514@example.com',
    'password': 'Password123!',
    'confirm_password': 'Password123!',
    'first_name': 'adi',
    'last_name': 'singh',
    'title': 'Mr',
    'phone_number': '1234567890',
    'institute': 'Inst',
    'department': 'computer engineering',
    'location': 'Loc',
    'state': 'IN-MH',  # Valid state
    'how_did_you_hear_about_us': 'FOSSEE website'
}
encoded_data = urllib.parse.urlencode(data).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:8000/workshop/register/', data=encoded_data)

try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    print('Status:', response.status)
    if 'errorlist' in html:
        import re
        errors = re.findall(r'<ul class="errorlist">(.*?)</ul>', html, re.DOTALL)
        print('Form Errors:', errors)
    else:
        print('No errorlist found.')
except urllib.error.HTTPError as e:
    html = e.read().decode('utf-8')
    print('Status:', e.code)
    import re
    errors = re.search(r'Exception Value:\s*<pre>(.*?)</pre>', html, re.DOTALL)
    if errors:
        print('Exception:', errors.group(1).strip())
    else:
        print('Response:', html[:1000])

