from werkzeug.security import check_password_hash
hash_str = 'scrypt:32768:8:1$DeR4R030D2F81bi8$8d59c79e052f470630c25a84cf931fa60abd1815ae4006049378e320913818dcd17ea4483a12d8331b60d79a5055aeed226ef94909876aecaf20bec9f9487cc5'
print('Old matches zaona2026?', check_password_hash(hash_str, 'zaona2026'))
