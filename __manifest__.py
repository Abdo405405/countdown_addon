{
    'name': 'Countdown Widget',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Custom countdown widget for datetime fields',
    'description': """
        This module provides a custom countdown widget that can be used with any datetime or date field.
        The widget displays a beautiful countdown showing days, hours, minutes, and seconds remaining.
    """,
    'author': 'Eng/Abdulrahman Mohamed',
    'website': '',
    'images' : ['static/description/icon.png'],
    'license' : 'LGPL-3',
    # 'license' : 'OPL-1',
    # 'price': 50,
    # 'currency': 'USD',
    'depends': ['base', 'web'],
    'data': [
    ],
    'assets': {
        'web.assets_backend': [
            'countdown_widget/static/src/js/countdown_widget.js',
            'countdown_widget/static/src/css/countdown_widget.css',
            'countdown_widget/static/src/xml/countdown_widget.xml',
        ],
    },
    'installable': True,
    'auto_install': False,
    'application': False,

}
